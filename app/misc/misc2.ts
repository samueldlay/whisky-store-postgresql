export {};

const addTwoNumbers = (num1: number, num2: number): number => {
  return num1 + num2;
}

function testAdd (condition: {expected: number}, ...args: number[]): string {
  const addArgs = args.reduce((acc: number, arg: number) => acc + arg);
  if (addArgs === condition.expected) return 'PASS';
  return 'FAIL';
}



const test = testAdd({expected: 50}, 25, 15, 10);

console.log(test);


console.log(7 % 5 === 0);

for (let i: number = 0; i < 100; i++) {
  if (i % 5 === 0 && i % 3 === 0) console.log(i + ' is divisible by 3 and 5');
  else if (i % 3 === 0) console.log(i + ' ' + 'is divisible by ' + 3);
  else if (i % 5 === 0) console.log(i + ' is divisible by ' + 5);
}


const nums: number[] = [1, 7,];

for (let j: number = 0; j < nums.length; j++) {
  for (let i: number = 0; i < 100; i++) {
      if (i % nums[j] !== 0) console.log(`${i} is not evenly divisible by ${nums[j]}`);
      else console.log(`${i} is evenly divisible by ${nums[j]}`);
  }
}
