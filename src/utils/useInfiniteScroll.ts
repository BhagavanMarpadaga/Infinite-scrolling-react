import { useEffect, useState } from 'react'
import axios from 'axios'


const useInfiniteScroll = (query:string,pageNumber: number) => {

    const [loading, setLoading] = useState(false);
    const [error,setError] = useState<string>("")
    const [searchResult, setSearchResult ] = useState<Array<never>>([]);
    const [hasMore,setHasMore] = useState<boolean>(false)

    
    useEffect(()=>{

        const interval = setTimeout(()=>{
            const run=()=>{
                setLoading(true)
                axios({
                    url:"https://openlibrary.org/search.json",
                    params:{q:query, pageNumber:pageNumber},
                }).then(res=>{
                  
                    setHasMore((_prev:boolean)=>{
                        console.log(res.data.numFound > (pageNumber*100))
                        if(res.data.numFound > (pageNumber*100)){
                            return true
                        }else{
                            return false
                        }
                    })
                    setSearchResult((prevResult)=>([...prevResult,...res.data.docs] as Array<never>))
                }).catch((err:unknown)=>{
                    console.log('error is ',err)
                    if(typeof(err)==='object'){
                        err = JSON.stringify(err)
                    }
                    setError(err as string)
                }).finally(()=>{
                    setLoading(false)
                })
            }
            run();
        },300)

        return ()=>{clearInterval(interval)}

    },[query,pageNumber])


    return {searchResult,error,loading,hasMore}  
}

export default useInfiniteScroll