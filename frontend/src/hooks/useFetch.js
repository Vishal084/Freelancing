
// import { useState, useEffect } from 'react'

// /**
//  * Generic hook for fetching data inside a component.
//  * Note: For global app state (services, projects, orders), prefer Redux thunks.
//  * This hook is best for one-off component-specific data.
//  *
//  * @param {Function} fetchFn - Async function that returns a promise
//  * @param {Array} deps - Dependencies to re-run effect
//  * @returns {Object} { data, loading, error }
//  */
// const useFetch = (fetchFn, deps = []) => {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     let isMounted = true
//     setLoading(true)
//     setError(null)

//     fetchFn()
//       .then((result) => {
//         if (isMounted) setData(result)
//       })
//       .catch((err) => {
//         if (isMounted) setError(err.message)
//       })
//       .finally(() => {
//         if (isMounted) setLoading(false)
//       })

//     return () => { isMounted = false }
//   }, deps) // eslint-disable-line react-hooks/exhaustive-deps

//   return { data, loading, error }
// }

// export default useFetch






// currently these files are not in use 