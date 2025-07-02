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

async function getWalletDetail(eventType, registerNumber, accessToken) {
  const url = `${
    process.env.GATEWAY_URL
  }m-retail-contactless-service/kiosk/${eventType}/walletDetail?register=${encodeURIComponent(
    registerNumber
  )}`;
  const response = await instance.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response?.data, "response?.data === walletData");
  return response?.data;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const eventType = searchParams.get("eventType");
    const registerNumber = searchParams.get("registerNumber");

    const tokenData = await getAccessToken();
    if (tokenData?.code?.startsWith("2") && tokenData?.data?.access_token) {
      const walletData = await getWalletDetail(
        eventType,
        registerNumber,
        tokenData.data.access_token
      );
      if (walletData.data) {
        return NextResponse.json(walletData, { status: 200 });
      } else {
        throw new Error("Failed to get data");
      }
    } else {
      throw new Error("Failed to get token");
    }
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
