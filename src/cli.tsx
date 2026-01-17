import { useState } from 'react';
import { render, Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { NModFSM } from './NModFSM.js';
import type { BinaryInput } from './types.js';

const App = () => {
  const { exit } = useApp();
  const [modulusStr, setModulusStr] = useState('');
  const [modulus, setModulus] = useState<number | null>(null);
  const [binaryInput, setBinaryInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleModulusSubmit = (value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive integer modulus.');
      return;
    }
    setModulus(parsed);
    setError(null);
  };

  const handleBinarySubmit = (value: string) => {
    if (value === 'exit') {
      exit();
      return;
    }
    if (value === 'back') {
      setModulus(null);
      setResult(null);
      setBinaryInput('');
      setError(null);
      return;
    }

    if (!modulus) return;
    if (!/^[01]+$/.test(value)) {
      setError(
        'Please enter a valid binary string (0s and 1s only), "back" to reset, or "exit" to quit.',
      );
      return;
    }

    try {
      const fsm = new NModFSM(modulus);
      const startTime = performance.now();

      for (const char of value) {
        fsm.transition(char as BinaryInput);
      }

      const endTime = performance.now();
      const finalState = fsm.getState();
      const remainder = finalState.substring(1);

      setResult(remainder);
      setTimeTaken(endTime - startTime);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const content = (() => {
    if (modulus === null) {
      return (
        <Box flexDirection="column" padding={1}>
          <Text>Enter Modulus (N):</Text>
          <Box>
            <Text color="green">{'> '}</Text>
            <TextInput
              value={modulusStr}
              onChange={setModulusStr}
              onSubmit={handleModulusSubmit}
            />
          </Box>
          {error && <Text color="red">{error}</Text>}
        </Box>
      );
    }

    return (
      <Box flexDirection="column" padding={1}>
        <Text>
          Modulus set to: <Text color="green">{modulus}</Text>
        </Text>
        <Text>
          Enter Binary Number (press Enter to calculate, 'back' to reset, 'exit'
          to quit):
        </Text>
        <Box>
          <Text color="cyan">{'> '}</Text>
          <TextInput
            value={binaryInput}
            onChange={(val) => {
              setBinaryInput(val);
              setResult(null);
              setTimeTaken(null);
              setError(null);
            }}
            onSubmit={handleBinarySubmit}
          />
        </Box>
        {error && <Text color="red">Error: {error}</Text>}
        {result !== null && (
          <Box
            marginTop={1}
            flexDirection="column"
            borderStyle="round"
            borderColor="green"
            paddingX={1}
          >
            <Text>
              Input (Decimal):{' '}
              <Text color="blue">
                {binaryInput ? BigInt('0b' + binaryInput).toString() : ''}
              </Text>
            </Text>
            <Text>
              Modulo: <Text color="magenta">{modulus}</Text>
            </Text>
            <Text>
              Remainder:{' '}
              <Text color="yellow" bold>
                {result}
              </Text>
            </Text>
            <Text dimColor>Time taken: {timeTaken?.toFixed(4)} ms</Text>
          </Box>
        )}
      </Box>
    );
  })();

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={process.stdout.rows - 2}
    >
      <Box
        borderStyle="double"
        padding={1}
        borderColor="cyan"
        flexDirection="column"
        width={80}
        height={20}
      >
        {content}
      </Box>
    </Box>
  );
};

console.clear();
render(<App />);
