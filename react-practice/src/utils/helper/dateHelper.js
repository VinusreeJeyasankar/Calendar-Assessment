//date helper function to make all dates in same format

export function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // returning as 'yyyy-mm-dd' format
}
  