/**
 * 
 * Utilisation :
 * const start = async () => {
 *      await asyncForEach([1,2,3], async (num) => {
 *          await waitFor(50);
 *          console.log(num);
 *      })
 *      console.log("Done")
 * }
 * start();
 * 
 * retourne :
 * $ 1
 * $ 2
 * $ 3
 * $ Done
 */
export async function asyncForEach<T>(array: T[], callback: (item: T, index: number, array: T[]) => void) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

