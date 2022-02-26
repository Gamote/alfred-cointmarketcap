interface Result {
  title: string;
  subtitle: string;
  arg?: string;
  text?: {
    copy: string;
    largetype: string;
  };
  mods?: {
    cmd: {
      arg: string;
      subtitle: string;
    };
  };
}

interface Input {
  apiKey: string;
  value: number;
  coinSource: string;
  defaultCoinOutput?: string;
  coinOutput: string;
}

const MISSING_ARGUMENT_MESSAGE = Object.freeze({
  title: `Incorrect argument`,
  subtitle: `Example: cmc 1 BTC EUR`,
});

const ERROR_MESSAGE = Object.freeze({
  title: `Incorrect request`,
  subtitle: `Are you sure thi coin exists? How about your API key?`,
});

const printResult = (result: Result) =>
  console.log(`${JSON.stringify({ items: [result] })}`);

/**
 * Parse the query into an {@link Input} type
 */
const parseQuery = (): Input => {
  // @ts-ignore
  const args = Deno.args[0].split(" ");

  // Checks the arguments
  if (!Array.isArray(args)) {
    throw new Error("Invalid args");
  }

  // Get the CoinMarketCap API key
  let apiKey = args[0];
  if (!apiKey) {
    throw new Error("Invalid CoinMarketCap API key");
  }
  args.splice(0, 1);

  // Get the default coin output
  let defaultCoinOutput = args[0];
  if (defaultCoinOutput) {
    args.splice(0, 1);
  }

  // Determine the value
  let value = Number(args[0]);
  if (isNaN(value)) {
    value = 1;
  } else {
    args.splice(0, 1);
  }

  // Determine the coin source
  let coinSource = args[0];
  if (!coinSource) {
    throw new Error("Invalid coin source");
  }

  // Determine the coin output
  let coinOutput = args[1];
  if (!coinOutput) {
    coinOutput = defaultCoinOutput ?? "USD";
  }

  return {
    apiKey,
    value,
    coinSource,
    defaultCoinOutput,
    coinOutput,
  }
}

/**
 * Entry point
 */
const main = async () => {
  let input: Input;

  // Parse input
  try {
    input = parseQuery();
  } catch (e) {
    return printResult(MISSING_ARGUMENT_MESSAGE);
  }

  const { apiKey, value, coinSource, coinOutput } = input;

  // Uppercase values
  const coinSourceUpperCase = coinSource.toUpperCase();
  const coinTargetUpperCase = coinOutput.toUpperCase();

  // Make the request
  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${value}&symbol=${coinSourceUpperCase}&convert=${coinTargetUpperCase}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
        },
      }
    );
    const { quote, name: coinSourceName } = (await response.json()).data;
    const result = quote[coinTargetUpperCase].price;
    const coinSourceNameUrl = coinSourceName.toLowerCase().replace(/ /g, "-");

    printResult({
      title: result,
      subtitle: `${value} ${coinSourceUpperCase} = ${result} ${coinTargetUpperCase}`,
      arg: result,
      text: {
        copy: result,
        largetype: `${value} ${coinSourceUpperCase} = ${result} ${coinTargetUpperCase}`,
      },
      mods: {
        cmd: {
          arg: `https://coinmarketcap.com/currencies/${coinSourceNameUrl}/`,
          subtitle: `Open ${coinSourceName} on CoinMarketCap`,
        },
      },
    });
  } catch(e) {
    printResult(ERROR_MESSAGE);
  }
}

void main();
