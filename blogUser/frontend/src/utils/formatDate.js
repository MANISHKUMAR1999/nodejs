
export function formatDate(date){
    const formatDate = new Date(date).toLocaleDateString()

    return formatDate
}