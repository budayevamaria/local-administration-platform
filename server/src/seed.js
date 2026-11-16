import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { connectDb, disconnectDb } from './config/db.js'
import { Bookmark, City, Comment, Notification, Post, Rating, User } from './models/index.js'

dotenv.config()

const lorem =
  'Lorem ipsum dolor sit amet consectetur. Diam arcu ut duis erat sed auctor consectetur dictum magna. Morbi sit pellentesque ullamcorper mauris aliquet quis in. Purus ultrices mollis interdum at egestas mi id egestas odio. Vitae massa dui egestas maecenas. Amet nunc tristique amet consectetur ultricies quisque mauris ac facilisis. Ut faucibus vitae velit gravida adipiscing. Purus orci vitae ultrices ullamcorper id integer orci habitant. Aliquam vestibulum elementum amet sed. Facilisis sed purus arcu et mattis et egestas cursus. Justo nisi quam vitae egestas consequat dignissim vel. Enim nunc est volutpat scelerisque eget. Donec fringilla sed aliquam velit. Porttitor bibendum rhoncus urna mattis mollis tellus sem in nisl. Hendrerit euismod sed ullamcorper orci.'

const noticeExcerpt =
  'Lorem ipsum dolor sit amet consectetur. Leo eget neque pretium sagittis. In egestas in est ipsum diam dapibus sem a. Nibh ultricies nullam ac faucibus scelerisque volutpat volutpat ultrices diam.'

const akimBio =
  'Viverra est odio ornare lorem ut id laoreet sed. Quam ac dis non interdum mattis odio amet elit congue. Id feugiat nisl laoreet hac eu et faucibus. Scelerisque molestie tempus lorem posuere sem et a sed sem.'

const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000)

async function hash(password) {
  return bcrypt.hash(password, 10)
}

export async function seed() {
  await Promise.all([
    City.deleteMany({}),
    User.deleteMany({}),
    Post.deleteMany({}),
    Rating.deleteMany({}),
    Comment.deleteMany({}),
    Notification.deleteMany({}),
    Bookmark.deleteMany({}),
  ])

  const [almaty, astana, shymkent] = await City.insertMany([
    { name: 'Almaty', districts: ['Medeu', 'Bostandyq', 'Almaly', 'Auezov'] },
    { name: 'Astana', districts: ['Esil', 'Almaty', 'Saryarka', 'Baikonyr'] },
    { name: 'Shymkent', districts: ['Abai', 'Al-Farabi', 'Enbekshi', 'Karatau'] },
  ])

  const [resident, akim1, akim2, akim3, resident2, admin] = await User.create([
    {
      name: 'Aigerim Nurlanova',
      email: 'resident@gmail.com',
      password: await hash('resident'),
      role: 'resident',
      city: almaty._id,
      district: 'Medeu',
      avatar: '/images/resident.jpg',
      cover: '/images/resident_bg.jpg',
      headerPhoto: '/images/header.jpg',
      bio: 'Resident of Almaty. Following local infrastructure and public works.',
    },
    {
      name: 'Dias Beketov',
      email: 'akim@represent.kz',
      password: await hash('akim'),
      role: 'akim',
      city: almaty._id,
      district: 'Almaly',
      title: 'Akim of Almaty',
      avatar: '/images/akim1.jpg',
      cover: '/images/akim1_bg.png',
      headerPhoto: '/images/header.jpg',
      bio: akimBio,
    },
    {
      name: 'Alikhan Sarsembayev',
      email: 'akim2@represent.kz',
      password: await hash('akim'),
      role: 'akim',
      city: almaty._id,
      district: 'Bostandyq',
      title: 'Akim of Bostandyq district',
      avatar: '/images/akim2.jpg',
      cover: '/images/park.jpg',
      headerPhoto: '/images/header.jpg',
      bio: akimBio,
    },
    {
      name: 'Dana Serikova',
      email: 'dana@represent.kz',
      password: await hash('akim'),
      role: 'akim',
      city: shymkent._id,
      district: 'Abai',
      title: 'Akim of Abai district',
      avatar: '/images/akim3.webp',
      cover: '/images/clinic.jpg',
      headerPhoto: '/images/header.jpg',
      bio: akimBio,
    },
    {
      name: 'Yerlan Tulegenov',
      email: 'yerlan@represent.kz',
      password: await hash('resident'),
      role: 'resident',
      city: almaty._id,
      district: 'Bostandyq',
      avatar: '/images/yerlan.jpg',
      cover: '/images/park.jpg',
      headerPhoto: '/images/header.jpg',
      bio: 'Interested in transport and street lighting.',
    },
    {
      name: 'System Admin',
      email: 'admin@represent.kz',
      password: await hash('admin'),
      role: 'admin',
      city: astana._id,
      district: 'Esil',
      avatar: '/images/admin.jpg',
      cover: '/images/cover.jpg',
      headerPhoto: '/images/header.jpg',
      bio: 'Moderates users, posts, comments, cities and districts.',
    },
  ])

  const [p1, p2, p3, p4, p5] = await Post.create([
    {
      author: akim1._id,
      title: 'Working meeting on district development',
      body: lorem,
      photo: '/images/post1.png',
      city: almaty._id,
      district: 'Almaly',
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(5),
    },
    {
      author: akim2._id,
      title: 'Road reconstruction on the northern bypass',
      body: lorem,
      photo: '/images/post2.jpg',
      city: almaty._id,
      district: 'Bostandyq',
      createdAt: hoursAgo(10),
      updatedAt: hoursAgo(10),
    },
    {
      author: akim1._id,
      title: 'New playground opened near the school',
      body: lorem,
      photo: '/images/post3.jpg',
      city: almaty._id,
      district: 'Almaly',
      createdAt: hoursAgo(15),
      updatedAt: hoursAgo(15),
    },
    {
      author: akim3._id,
      title: 'Clinic renovation completed',
      body: 'Interior renovation of the district clinic is finished: waiting area, reception, and two treatment rooms. Visiting hours remain unchanged.',
      photo: '/images/post4.jpg',
      city: shymkent._id,
      district: 'Abai',
      createdAt: hoursAgo(30),
      updatedAt: hoursAgo(30),
    },
    {
      author: akim2._id,
      title: 'Community meeting follow-up',
      body: lorem,
      photo: '/images/post5.webp',
      city: almaty._id,
      district: 'Bostandyq',
      createdAt: hoursAgo(40),
      updatedAt: hoursAgo(40),
    },
  ])

  await Rating.create([
    { post: p1._id, user: resident._id, value: 5 },
    { post: p1._id, user: resident2._id, value: 5 },
    { post: p2._id, user: resident._id, value: 5 },
    { post: p2._id, user: resident2._id, value: 5 },
    { post: p3._id, user: resident2._id, value: 5 },
    { post: p4._id, user: resident._id, value: 5 },
    { post: p5._id, user: resident2._id, value: 5 },
    { post: p5._id, user: resident._id, value: 5 },
  ])

  await Comment.create([
    {
      post: p1._id,
      user: resident._id,
      body: 'Glad to see the meeting results published. Please share the timeline for the next stage.',
      createdAt: hoursAgo(4),
    },
    {
      post: p1._id,
      user: akim1._id,
      body: 'The schedule will be posted this week. Thank you for the feedback.',
      createdAt: hoursAgo(3),
    },
    {
      post: p2._id,
      user: resident2._id,
      body: 'The detour is confusing in the evening. Better signs would help.',
      createdAt: hoursAgo(8),
    },
    {
      post: p3._id,
      user: resident._id,
      body: 'The playground looks great. Could you add a trash bin near the benches?',
      createdAt: hoursAgo(12),
    },
  ])

  await Notification.create([
    {
      user: resident._id,
      author: akim1._id,
      post: p1._id,
      title: 'New post from Dias Beketov',
      excerpt: noticeExcerpt,
      to: `/posts/${p1._id}`,
      read: false,
      createdAt: hoursAgo(5),
    },
    {
      user: resident._id,
      author: akim2._id,
      post: p2._id,
      title: 'New post from Alikhan Sarsembayev',
      excerpt: noticeExcerpt,
      to: `/posts/${p2._id}`,
      read: false,
      createdAt: hoursAgo(10),
    },
    {
      user: resident._id,
      author: akim1._id,
      post: p3._id,
      title: 'New post from Dias Beketov',
      excerpt: noticeExcerpt,
      to: `/posts/${p3._id}`,
      read: true,
      createdAt: hoursAgo(15),
    },
    {
      user: akim1._id,
      author: resident._id,
      post: p1._id,
      title: 'Aigerim Nurlanova rated your post',
      excerpt: 'Your work received a 5-star rating.',
      to: `/posts/${p1._id}`,
      read: false,
      createdAt: hoursAgo(2),
    },
  ])

  await Bookmark.create([{ user: resident._id, post: p5._id }])

  return {
    cities: await City.countDocuments(),
    users: await User.countDocuments(),
    posts: await Post.countDocuments(),
    ratings: await Rating.countDocuments(),
    comments: await Comment.countDocuments(),
    notifications: await Notification.countDocuments(),
    bookmarks: await Bookmark.countDocuments(),
    adminEmail: admin.email,
  }
}

const isDirectRun = process.argv[1] && process.argv[1].endsWith('seed.js')

if (isDirectRun) {
  try {
    await connectDb()
    const counts = await seed()
    console.log('Seed completed:', counts)
    await disconnectDb()
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    await disconnectDb().catch(() => {})
    process.exit(1)
  }
}
