import { View, Image, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { colors } from '@/utils/color';

interface PostData {
  id: number;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes?: number;
}

const Post = ({ item }: { item: PostData }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes ?? 0);

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <View className='mb-4'>
      {/* post header */}
      <View className='flex-row items-center px-4 mb-2'>
        <Image source={{ uri: item.avatar }}
          className='w-10 h-10 rounded-full'
        />
        <Text className='ml-3 font-semibold'>{item.username}</Text>
      </View>
      {/* post image */}
      <Image source={{ uri: item.image }}
        className='w-full h-96' resizeMode='cover'
      />
      {/* actions */}
      <View className='flex-row justify-between px-4 py-3'>
        <View className='flex-row gap-2 items-center'>
          <TouchableOpacity onPress={handleLike} activeOpacity={0.7}>
            {liked ? (
              <AntDesign name='heart' size={24} color='#e63946' />
            ) : (
              <AntDesign name='heart' size={24} color={colors.inactive} />
            )}
          </TouchableOpacity>
          {likeCount > 0 && (
            <Text className='text-sm font-semibold'>{likeCount}</Text>
          )}
        </View>
      </View>
      {/* post caption */}
      <View className='px-4 mt-2'>
        <Text className='text-sm'><Text className='font-bold'>{item.username}</Text> {item.caption}</Text>
      </View>
    </View>
  )
}

export default Post
