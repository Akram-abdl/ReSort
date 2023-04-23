import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Flex, Box, useColorModeValue } from '@chakra-ui/react';

interface SortingVisualizerProps {
  array: number[];
  key: string;
}


export const SortingVisualizer = forwardRef<HTMLDivElement, SortingVisualizerProps>(({ array }, ref) => {
  const bg = useColorModeValue('gray.200', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const innerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  return (
    <Box
      width="100%"
      height="80vh"
      bg={bg}
      borderRadius="md"
      boxShadow="md"
      p={4}
      overflow="hidden"
    >
      <Flex ref={innerRef} justifyContent="space-between" height="100%" alignItems="flex-end">
        {array.map((value, index) => (
          <Box
            key={index}
            height={`${value}%`}
            width="2%"
            backgroundColor="teal"
            borderRadius="md"
            marginBottom="5px"
          />
        ))}
      </Flex>
    </Box>
  );
});

SortingVisualizer.displayName = 'SortingVisualizer';

export default SortingVisualizer;
