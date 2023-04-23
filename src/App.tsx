import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorMode,
  Flex,
  Spacer,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { SortingVisualizer } from './components/SortingVisualizer';
import { bubbleSort, selectionSort, mergeSort, quickSort, heapSort, insertionSort, bogoSort } from './logic/sortingAlgorithms';

type SortingAlgorithm = (
  arr: number[],
  onSwap: (i: number, j: number) => void,
  onCompare: (i: number, j: number) => void,
  speed: number,
  onRender?: () => void, // Make onRender an optional parameter
) => Promise<void>;


const App = () => {
  const [algorithm, setAlgorithm] = useState('Bubble Sort');
  const [sorting, setSorting] = useState(false);
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(50);
  const visualizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5);
    setArray(newArray);
  };

  const handleArraySizeChange = (value: number) => {
    setArraySize(value);
    resetArray();
  };

  const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(event.target.value);
  };

  const handleSort = async () => {
    setSorting(true);

    const speed = 50;

    const onSwap = async (i: number, j: number) => {
      if (visualizerRef.current) {
        const bars = visualizerRef.current.children;
        const barOne = bars[i] as HTMLElement;
        const barTwo = bars[j] as HTMLElement;

        barOne.style.backgroundColor = 'red';
        barTwo.style.backgroundColor = 'red';

        await new Promise(resolve => setTimeout(resolve, speed));

        const barOneHeight = barOne.style.height;
        const barTwoHeight = barTwo.style.height;
        barOne.style.height = barTwoHeight;
        barTwo.style.height = barOneHeight;


        barOne.style.backgroundColor = 'teal';
        barTwo.style.backgroundColor = 'teal';
      }
    };

    const onCompare = async (i: number, j: number) => {
      if (visualizerRef.current) {
        const bars = visualizerRef.current.children;
        const barOne = bars[i] as HTMLElement;
        const barTwo = bars[j] as HTMLElement;

        barOne.style.backgroundColor = 'blue';
        barTwo.style.backgroundColor = 'blue';

        await new Promise(resolve => setTimeout(resolve, speed));

        barOne.style.backgroundColor = 'teal';
        barTwo.style.backgroundColor = 'teal';
      }
    }

    const onRender = () => {
      if (visualizerRef.current) {
        const bars = visualizerRef.current.children;
        for (let i = 0; i < bars.length; i++) {
          const bar = bars[i] as HTMLElement;
          bar.style.height = `${array[i]}%`;
        }
      }

    };


    type AlgorithmMap = {
      [key: string]: SortingAlgorithm;
    };


    const algorithms: Record<string, SortingAlgorithm> = {
      "Bubble Sort": bubbleSort,
      "Selection Sort": selectionSort,
      "Insertion Sort": insertionSort,
      "Merge Sort": mergeSort,
      "Quick Sort": quickSort,
      "Heap Sort": heapSort,
      "Bogo Sort": bogoSort,
    };


    const sortingAlgorithm = algorithms[algorithm];


    if (algorithm === 'Merge Sort') {
      await mergeSort(array, onCompare, onRender, speed, onSwap);
    } else if (sortingAlgorithm) {
      await sortingAlgorithm([...array], onSwap, onCompare, speed);
      setArray((prevArray) => [...prevArray]); // Update the array state after sorting is done
    }


    setSorting(false);
  };

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.900");

  return (
    <Box w="100vw" h="100vh" bg={bg}>
      <Flex direction="column" align="center" justify="center" h="100%" py={8}>
        <SortingVisualizer ref={visualizerRef} array={array} key={array.join(',')} />
        <HStack spacing={4} my={4}>
          <Select value={algorithm} onChange={handleAlgorithmChange}>
            <option>Bubble Sort</option>
            <option>Selection Sort</option>
            <option>Merge Sort</option>
            <option>Quick Sort</option>
            <option>Heap Sort</option>
            <option>Insertion Sort</option>
            <option>Bogo Sort</option>
          </Select>
          <Button onClick={handleSort} disabled={sorting}>
            Sort
          </Button>
          <Button onClick={resetArray} disabled={sorting}>
            Reset Array
          </Button>
          <Slider
            aria-label="array-size-slider"
            defaultValue={50}
            min={5}
            max={200}
            onChange={handleArraySizeChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>
        <Flex w="100%" px={8}>
          <Spacer />
          <Button colorScheme={colorMode === 'light' ? 'black' : 'white'} onClick={toggleColorMode}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
export default App;