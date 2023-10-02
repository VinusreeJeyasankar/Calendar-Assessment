//date helper function to make all dates in same format

export const formatDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex for yyyy-mm-dd format
  
    if (regex.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    }
    // console.log("dateString", dateString)
    return dateString; // Return as is if not in yyyy-mm-dd format
};
