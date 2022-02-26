# Alfred CoinMarketCap

Alfred workflow for quick currencies conversion using [CoinMarketCap API](https://coinmarketcap.com/api).

![Alfred CoinMarketCap screenshot](assets/screenshot.png)

## Pre-Requisites

- The [Deno](https://deno.land) runtime installed (`brew install deno`)
- The [CoinMarketCap API Key](https://coinmarketcap.com/api) (the free plan should is more than enough)

## How to use

- `cmc btc` - Convert 1 Bitcoin to the default currency. If no default currency was specified `USD` will be used
- `cmc btc eur` - Convert 1 Bitcoin to specified currency (`Euro` in this case)
- `cmc 1.5 btc eur` - Specify a specific amount to convert

For all the variants you can:
- Hit `↵` to copy the result to clipboard
- Hold `⌘` key and hit `↵` to open CoinMarketCap website on selected coin
