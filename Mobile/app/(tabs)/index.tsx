import  {FlatList} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Post from '../../components/Post'

const index = () => {

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
  return (
    <SafeAreaView>
      <FlatList data={posts} keyExtractor={(item)=>item.id.toString()} showsVerticalScrollIndicator={false} renderItem={({item}) => <Post item={item}/>}/>
    </SafeAreaView>
  )
}

export default index