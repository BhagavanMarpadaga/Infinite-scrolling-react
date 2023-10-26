import { useCallback, useRef, useState } from 'react'
import useInfiniteScroll from './utils/useInfiniteScroll'

function App() {
  const [text, setText] = useState<string>("")
  const [pageNumber,setPageNumber]=useState<number>(0)
  const {loading,error,searchResult, hasMore} = useInfiniteScroll(text,pageNumber)
  // console.log(loading,error,searchResult)
  const observer = useRef<IntersectionObserver>()
  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setText(e.target.value)
  }
  const callBackRef = useCallback((node:HTMLDivElement | null)=>{
    if(loading) return
    //if observer has already something we need to disconnect that 
    if(observer.current) observer.current.disconnect()
    console.log(node)

    observer.current = new IntersectionObserver((entries)=>{
      // console.log(entries[0])
      if(entries[0].isIntersecting ){
        console.log('visible')
        setPageNumber((prevPage=>prevPage+1))
      }
    })

    if(node && observer.current) {
      observer.current.observe(node)
    }

  },[])

  return (
    <>
      <input type='text' value ={text} onChange={handleChange}></input>
      {
        searchResult.map((book:{[key:string]:string},index:number)=>{
          if(index+1 === searchResult.length-50){
            return <div key={index+1} ref={callBackRef}>{index}</div>
          }else{
            return <div key={index+1}>{index}</div>
          }
        })
      }
      {error && <div>{error}</div>}
      {loading && <div>Loading ...</div>}
    </>
  )
}

export default App
