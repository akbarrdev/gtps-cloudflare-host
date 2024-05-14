# GTPS Host and Connection Counter using Cloudflare Workers KV Store

This code is designed to serve as a GTPS endpoint host, which allows players to avoid changing the IP address in the host every time they switch RDP/VPS. Another benefit is that we can keep track of the total connections per day, month, and overall. This code is run using the KV store in Cloudflare Workers.

## Overview

The primary purpose of this code is to provide a stable endpoint for GTPS hosting, eliminating the need for players to change the IP address in the host every time they switch RDP/VPS. Additionally, it offers the ability to monitor the total number of connections made per day, month, and overall, leveraging the KV store in Cloudflare Workers.

## Installation and Usage

1. Create a Cloudflare account.
2. Install Wrangler by running
   ```
   npm install wrangler --save-dev
   ```
    or
   ```
   yarn add --dev wrangler
   ```
3. Create a new Cloudflare application with
   ```bash
   npm create cloudflare@latest <folder-name>
   ```
4. Select **Worker built from a template hosted in a git repository**.
5. Enter
   `https://github.com/akbarrdev/gtps-cloudflare-host`
6. Wait for the package installation to complete. If you don't want to use Git, choose **no**
7. Log in to your Cloudflare account using Wrangler with
    ```
    npx wrangler login
    ```
8. Create a new KV namespace with 
    ```
    wrangler kv:namespace create <new-namespace-name>
    ```
10. Copy the provided bracket and paste it into `wrangler.toml`.
11. To run the worker locally, use 
    ```
    npx wrangler run dev src/index
    ```
  To deploy directly to the worker, use 
    ```
    npx wrangler deploy src/index
    ```
  You will be provided with a link to the running worker.

## Join Our Communities

- [Join the Akbarrdev WhatsApp channel to get access to other codes and resources.](https://whatsapp.com/channel/0029VaZAopA8fewhXJvqxt18)
- [Join the TeamNevolution WhatsApp group for further discussions and support.](https://chat.whatsapp.com/BtboXzaZAQeHiJ0Epzwn7M)

If you encounter any issues or have questions, feel free to ask `akbarrdev` on discord.
