import { useState, useEffect } from 'react'
import type { InferGetStaticPropsType, GetStaticProps } from 'next'
 
type Repo = {
  name: string
  stargazers_count: number
}
 
export const getStaticProps: GetStaticProps<{
  repo: Repo
  msg: string
}> = async () => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo,msg:'123' } }
}

export default function HomePage({
    repo,
    msg
  }: InferGetStaticPropsType<typeof getStaticProps>) {
    const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return <>
    <h1>HomePage</h1>
    <p>{data.msg} {msg}</p>
    <p>{repo.name} : {repo.stargazers_count??0}</p>
  </>
}