import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter rdes ID number (number only): ', (rdesId) => {
  const radElementAPI = `https://api3.rsna.org/radelement/v1/sets/${rdesId}`;

  async function logElement() {
    try {
      const response = await fetch(radElementAPI);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const elements = await response.json();
      console.log(elements);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      rl.close();
    }
  }

  logElement();

  rl.close();
});
