const names: string[] = ['johnny', 'susy', 'sarah'];

function capitalizeListOfStrings (elements: string[]): string[] {
  return elements.map(element => {
    return (
      element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()
    );
});
}

function capitalizeString (string: string) {
  return (
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  );
}

function capitalizeFirstLastName (string: string): string {
  return string.split(' ').map(element => {
    return (
    element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()
  );
}).join(' ');
}

function capitalizeListFirstLast (elements: string[]): string[] {
  return elements.map((element: string) => {
    return element.split(' ').map(el => {
      return (
        el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()
      );
    }).join(' ');
  });
}

export default function capitalize (input: string | string[]): string | string[] {
  if (Array.isArray(input)) return capitalizeListFirstLast(input);
  else if (typeof input === 'string') return capitalizeFirstLastName(input);
  throw new Error('The type of input is neither a string nor an array of strings.')
}
// const Staff = ['SUSAN j. waltERS', 'john b. davIDSon', 'cheryl c. boDSon'];

// console.log(capitalize(3))
