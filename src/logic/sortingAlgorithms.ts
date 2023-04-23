const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function bubbleSort(
  arr: number[],
  onCompare: (i: number, j: number) => void,
  onRender: () => void,
  speed: number,
  onSwap: (i: number, j: number) => void,
): Promise<void> {
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      onCompare(j, j + 1);
      await sleep(speed);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        onSwap(j, j + 1);
      }
      await onRender();
    }
  }
}

export async function insertionSort(
  arr: number[],
  onCompare: (i: number, j: number) => void,
  onRender: () => void,
  speed: number,
  onSwap: (i: number, j: number) => void,
): Promise<void> {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      onCompare(j, j - 1);
      await sleep(speed);
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      onSwap(j, j - 1);
      await onRender();
      j--;
    }
  }
}

export async function mergeSort(
  arr: number[],
  onCompare: (i: number, j: number) => void,
  onRender: () => void,
  speed: number,
  onSwap: (i: number, j: number) => void,
): Promise<void> {
  async function merge(
    arr: number[],
    start: number,
    mid: number,
    end: number,
    onCompare: (i: number, j: number) => void,
    onRender: () => void,
    speed: number,
    onSwap: (i: number, j: number) => void,
  ): Promise<void> {
    const temp = [...arr];
    let i = start;
    let j = mid + 1;
    let k = start;

    while (i <= mid && j <= end) {
      onCompare(i, j);
      if (temp[i] <= temp[j]) {
        arr[k] = temp[i];
        onSwap(k, i);
        await sleep(speed);
        await onRender();
        i++;
      } else {
        arr[k] = temp[j];
        onSwap(k, j);
        await sleep(speed);
        await onRender();
        j++;
      }
      k++;
    }

    while (i <= mid) {
      arr[k] = temp[i];
      onSwap(k, i);
      await sleep(speed);
      await onRender();
      i++;
      k++;
    }

    while (j <= end) {
      arr[k] = temp[j];
      onSwap(k, j);
      await sleep(speed);
      await onRender();
      j++;
      k++;
    }
  }

  async function mergeSortHelper(
    arr: number[],
    start: number,
    end: number,
    onCompare: (i: number, j: number) => void,
    onRender: () => void,
    speed: number,
    onSwap: (i: number, j: number) => void,
  ): Promise<void> {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      await mergeSortHelper(arr, start, mid, onCompare, onRender, speed, onSwap);
      await mergeSortHelper(arr, mid + 1, end, onCompare, onRender, speed, onSwap);
      await merge(arr, start, mid, end, onCompare, onRender, speed, onSwap);
    }
  }

  await mergeSortHelper(arr, 0, arr.length - 1, onCompare, onRender, speed, onSwap);
}

// Quick Sort
export async function quickSort(
  arr: number[],
  onSwap: (i: number, j: number) => void,
  onCompare: (i: number, j: number) => void,
  onRender: () => void,
  speed: number
): Promise<void> {
  async function partition(low: number, high: number): Promise<number> {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
      onCompare(j, high);
      await sleep(speed);
      onRender();

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        onSwap(i, j);
        await sleep(speed);
        onRender();
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    onSwap(i + 1, high);
    await sleep(speed);
    onRender();

    return i + 1;
  }

  async function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = await partition(low, high);

      await quickSortHelper(low, pi - 1);
      await quickSortHelper(pi + 1, high);
    }
  }

  await quickSortHelper(0, arr.length - 1);
}

// Heap Sort
export async function heapSort(
  arr: number[],
  onSwap: (i: number, j: number) => void,
  onCompare: (i: number, j: number) => void,
  onRender: () => void,
  speed: number
): Promise<void> {
  const n = arr.length;

  async function heapify(size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      onCompare(left, largest);
      await sleep(speed);
      onRender();
    }

    if (left < size && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < size) {
      onCompare(right, largest);
      await sleep(speed);
      onRender();
    }

    if (right < size && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      onSwap(root, largest);
      await sleep(speed);
      onRender();

      await heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    onSwap(0, i);
    await sleep(speed);
    onRender();

    await heapify(i, 0);
  }
}

// Selection Sort
export async function selectionSort(
  arr: number[],
  onSwap: (i: number, j: number) => void,
  onCompare: (i: number, j: number) => void,
  onRender: () => void,
  speed: number
): Promise<void> {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      onCompare(minIndex, j);
      await sleep(speed);
      onRender();

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      onSwap(i, minIndex);
      await sleep(speed);
      onRender();
    }
  }
}

// Bogo Sort
export async function bogoSort(
  arr: number[],
  onSwap: (i: number, j: number) => void,
  onCompare: (i: number, j: number) => void,
  onRender: () => void,
  speed: number
): Promise<void> {
  function isSorted(): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  function shuffle() {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
      onSwap(i, j);
      onRender();
    }
  }

  while (!isSorted()) {
    onCompare(0, arr.length - 1);
    await sleep(speed);
    onRender();
    shuffle();
    await sleep(speed);
    onRender();
  }
}

