"use server";

import axios from "axios";
import https from "https";
import fs from "fs";
import { NextResponse } from "next/server";

const httpsAgent = new https.Agent({
  key: fs.readFileSync("enc-gw-key.pem"),
  cert: fs.readFileSync("gw-cert.pem"),
  passphrase: process.env.CERT_PASSWORD,
  rejectUnauthorized: false,
});

const instance = axios.create({ httpsAgent });

async function getAccessToken() {
  const data = {
    grant_type: "client_credentials",
    device_id: "contactless-kiosk",
  };
  const response = await instance.post(
    `${process.env.GATEWAY_URL}m-auth-main-service/token`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.BASIC_TOKEN}`,
      },
    }
  );
  console.log(response?.data, "response?.data === tokenData");
  return response?.data;
}

async function generateInvoice(amount, eventType, nfcId, accessToken) {
  const url = `${process.env.GATEWAY_URL}m-retail-contactless-service/kiosk/generateInvoice?`;
  const body = {
    amount: amount,
    eventType: eventType,
    nfcId: nfcId,
  };
  const response = await instance.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response?.data, "response?.data === generateInvoice");
  return response?.data;
}

export async function POST(request) {
  try {
    const { amount, eventType, nfcId } = await request.json();

    const tokenData = await getAccessToken();
    if (tokenData?.code?.startsWith("2") && tokenData?.data?.access_token) {
      const invoiceData = await generateInvoice(
        amount,
        eventType,
        nfcId,
        tokenData.data.access_token
      );
      if (invoiceData.data) {
        return NextResponse.json(invoiceData, { status: 200 });
      } else {
        throw new Error("Failed to get data");
      }
    } else {
      throw new Error("Failed to get token");
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create invoice" }), {
      status: 500,
    });
  }
}
