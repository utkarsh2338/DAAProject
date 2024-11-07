let array = [];
const ANIMATION_SPEED = 500;

// Get button elements
const newArrayBtn = document.getElementById('newArrayBtn');
const startSortBtn = document.getElementById('startSortBtn');

// Add event listeners
newArrayBtn.addEventListener('click', generateNewArray);
startSortBtn.addEventListener('click', startMergeSort);

function generateNewArray() {
    array = [];
    for(let i = 0; i < 8; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    displayArray(array);
    document.getElementById('steps-container').innerHTML = '';
}

// ... (previous code remains the same until displayArray function)

function displayArray(arr, containerId = 'array-container') {
    let arrayContainer;
    if (containerId === 'array-container') {
        arrayContainer = document.getElementById(containerId);
    } else {
        arrayContainer = containerId;
    }
    arrayContainer.innerHTML = '';
    
    arr.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${value * 3}px`;
        bar.style.width = '50px';
        bar.textContent = value;
        // Add entrance animation delay based on index
        bar.style.animation = `slideIn 0.5s ease-out ${index * 0.1}s`;
        arrayContainer.appendChild(bar);
    });
}

async function highlightBars(bars, className) {
    bars.forEach(bar => bar.classList.add(className));
    await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED));
    bars.forEach(bar => bar.classList.remove(className));
}

async function mergeSort(arr, start = 0, end = arr.length - 1, depth = 0) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    
    const stepContainer = document.createElement('div');
    stepContainer.className = 'step-container';
    stepContainer.style.marginLeft = `${depth * 20}px`;
    
    const description = document.createElement('p');
    description.textContent = `Dividing array [${arr.slice(start, end + 1).join(', ')}]`;
    description.style.animation = 'fadeIn 0.5s ease-out';
    stepContainer.appendChild(description);
    
    const arrayDiv = document.createElement('div');
    arrayDiv.className = 'array-container';
    displayArray(arr.slice(start, end + 1), arrayDiv);
    stepContainer.appendChild(arrayDiv);
    
    document.getElementById('steps-container').appendChild(stepContainer);
    await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED));
    
    await mergeSort(arr, start, mid, depth + 1);
    await mergeSort(arr, mid + 1, end, depth + 1);
    await merge(arr, start, mid, end, depth);
}

async function merge(arr, start, mid, end, depth) {
    const stepContainer = document.createElement('div');
    stepContainer.className = 'step-container';
    stepContainer.style.marginLeft = `${depth * 20}px`;
    
    const description = document.createElement('p');
    description.textContent = `Merging arrays [${arr.slice(start, mid + 1).join(', ')}] and [${arr.slice(mid + 1, end + 1).join(', ')}]`;
    description.style.animation = 'fadeIn 0.5s ease-out';
    stepContainer.appendChild(description);
    
    const leftArray = arr.slice(start, mid + 1);
    const rightArray = arr.slice(mid + 1, end + 1);
    const mergedArray = [];
    
    let i = 0, j = 0;
    
    const arrayDiv = document.createElement('div');
    arrayDiv.className = 'array-container';
    stepContainer.appendChild(arrayDiv);
    
    while (i < leftArray.length && j < rightArray.length) {
        // Highlight comparing elements
        displayArray([...mergedArray, ...leftArray.slice(i), ...rightArray.slice(j)], arrayDiv);
        const bars = arrayDiv.querySelectorAll('.array-bar');
        await highlightBars([bars[mergedArray.length], bars[mergedArray.length + 1]], 'comparing');
        
        if (leftArray[i] <= rightArray[j]) {
            mergedArray.push(leftArray[i]);
            i++;
        } else {
            mergedArray.push(rightArray[j]);
            j++;
        }
        
        // Show merged result
        displayArray([...mergedArray, ...leftArray.slice(i), ...rightArray.slice(j)], arrayDiv);
        const newBars = arrayDiv.querySelectorAll('.array-bar');
        await highlightBars([newBars[mergedArray.length - 1]], 'sorted');
    }
    
    while (i < leftArray.length) {
        mergedArray.push(leftArray[i]);
        i++;
        displayArray([...mergedArray, ...leftArray.slice(i), ...rightArray.slice(j)], arrayDiv);
    }
    
    while (j < rightArray.length) {
        mergedArray.push(rightArray[j]);
        j++;
        displayArray([...mergedArray, ...leftArray.slice(i), ...rightArray.slice(j)], arrayDiv);
    }
    
    // Update the original array
    for (let i = 0; i < mergedArray.length; i++) {
        arr[start + i] = mergedArray[i];
    }
    
    document.getElementById('steps-container').appendChild(stepContainer);
    await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED));
}

async function startMergeSort() {
    try {
        newArrayBtn.disabled = true;
        startSortBtn.disabled = true;
        
        // Add loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        document.querySelector('.container').appendChild(spinner);
        
        document.getElementById('steps-container').innerHTML = '';
        const arrayCopy = [...array];
        await mergeSort(arrayCopy);
        array = arrayCopy;
        displayArray(array);
        
        // Remove spinner
        spinner.remove();
        
        // Show completion message
        const completionMsg = document.createElement('div');
        completionMsg.textContent = 'Sorting Complete!';
        completionMsg.style.animation = 'fadeIn 0.5s ease-out';
        completionMsg.style.color = '#2c3e50';
        completionMsg.style.fontSize = '1.2em';
        completionMsg.style.margin = '20px';
        document.getElementById('steps-container').appendChild(completionMsg);
    } catch (error) {
        console.error('Error during merge sort:', error);
    } finally {
        newArrayBtn.disabled = false;
        startSortBtn.disabled = false;
    }
}

// Generate initial array when page loads
generateNewArray();