/* eslint-disable react-hooks/rules-of-hooks */

import  {FlatList} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Post from '../../components/Post'
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import API from '@/config/koneksi';
import { item } from '@/types/Feed';

const index = () => {
  const {token, user} = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState<item[]>([])
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [totalPage, setTotalPage] = useState()


  const posts = [
    {
    caption: "Ngoding sebelum tidur, auto produktif 👩‍🚀",
    id: 4,
    username: "mobiledev",
    avatar: "https://i.pravatar.cc/150?img=4",
    image: "https://picsum.photos/500/500?random=4",
  },
  {
    caption: "Expo Router bikin navigasi makin rapi 😍",
    id: 5,
    username: "backendguy",
    avatar: "https://i.pravatar.cc/150?img=5",
    image: "https://picsum.photos/500/500?random=5",
  },
  {
    id: 6,
    username: "designinspirasi",
    avatar: "https://i.pravatar.cc/150?img=6",
    image: "https://picsum.photos/500/500?random=6",
    caption: "Warna yang tepat bikin aplikasi lebih hidup 😍",
  },
  {
    id: 7,
    username: "coderlife",
    avatar: "https://i.pravatar.cc/150?img=7",
    image: "https://picsum.photos/500/500?random=7",
    caption: "Debugging adalah seni mencari kesalahan 😂", 
  },
  {
    id: 8,
    username: "reactmaster",
    avatar: "https://i.pravatar.cc/150?img=8",
    image: "https://picsum.photos/500/500?random=8",
    caption: "Component reusable bikin project scalable 😂",
  },
  {
    id: 9,
    username: "fullstackdev",
    avatar: "https://i.pravatar.cc/150?img=9",
    image: "https://picsum.photos/500/500?random=9",
    caption: "Frontend + Backend = Fullstack power 😂",
  },
  {
    id: 10,
    username: "belajarkoding",
    avatar: "https://i.pravatar.cc/150?img=10",
    image: "https://picsum.photos/500/500?random=10",
    caption: "Step by step, progress tetap jalan 😊",
  }
  ];

  
  const Feed = async() => {
    if(loading) return;
    if(totalPage !== undefined && page > totalPage) return;
    setLoading(true);
    try {
      const {data} = await API.get(`/feed?page=1&limit=5`);
      setPostData((prev)=>[...prev, ...data.data]);
      setTotalPage(data.totalPage);
      setPage((prev) => prev+1);
      console.log(data);
      
    } catch (error) {
      console.log(error);
      
    }finally{
      setLoading(false)
    }
  };

  useEffect(()=>{
    Feed()
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-bacground'>
      <Header/>
      <FlatList data={postData} keyExtractor={(item)=>item.id.toString()} showsVerticalScrollIndicator={false} renderItem={({ item }) => <Post item={item} />} />
    </SafeAreaView>
  )
}

export default index