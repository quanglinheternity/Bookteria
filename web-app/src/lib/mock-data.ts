export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  avatar: string
  bio: string
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing: boolean
  level: string
}

export interface Location {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  province: string
  category: string
  parentLocationId?: string
  level: "country" | "province" | "district" | "landmark"
}

export interface Post {
  id: string
  author: User
  location: Location
  content: string
  images: string[]
  likesCount: number
  commentsCount: number
  savesCount: number
  isLiked: boolean
  isSaved: boolean
  createdAt: string
  tags: string[]
  photoTip?: string
}

export interface Comment {
  id: string
  author: User
  content: string
  createdAt: string
  likesCount: number
  isLiked: boolean
  replies?: Comment[]
}

export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "checkin" | "mention"
  actor: User
  message: string
  postImage?: string
  createdAt: string
  isRead: boolean
}

export interface CheckIn {
  id: string
  user: User
  location: Location
  photo: string
  note: string
  createdAt: string
}

const USERS: User[] = [
  {
    id: "u1",
    username: "minhphoto",
    firstName: "Minh",
    lastName: "Tran",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    bio: "Photographer | Capturing the soul of Vietnam one frame at a time",
    followersCount: 2340,
    followingCount: 180,
    postsCount: 156,
    isFollowing: false,
    level: "Pro Scout",
  },
  {
    id: "u2",
    username: "linhexplorer",
    firstName: "Linh",
    lastName: "Nguyen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    bio: "Travel & landscape photographer | Ha Noi based",
    followersCount: 5120,
    followingCount: 320,
    postsCount: 284,
    isFollowing: true,
    level: "Elite Scout",
  },
  {
    id: "u3",
    username: "ducstreetphoto",
    firstName: "Duc",
    lastName: "Pham",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    bio: "Street photography | Da Nang life through my lens",
    followersCount: 890,
    followingCount: 245,
    postsCount: 78,
    isFollowing: false,
    level: "Scout",
  },
  {
    id: "u4",
    username: "huyenphoto",
    firstName: "Huyen",
    lastName: "Le",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    bio: "Portrait & fashion | Saigon dreamer",
    followersCount: 3450,
    followingCount: 210,
    postsCount: 198,
    isFollowing: true,
    level: "Pro Scout",
  },
  {
    id: "u5",
    username: "namlandscape",
    firstName: "Nam",
    lastName: "Vo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    bio: "Landscape addict | Sa Pa & Ha Giang regular",
    followersCount: 1780,
    followingCount: 156,
    postsCount: 92,
    isFollowing: false,
    level: "Pro Scout",
  },
]

export const LOCATIONS: Location[] = [
  // Root country
  {
    id: "l0",
    name: "Vietnam",
    address: "Socialist Republic of Vietnam",
    latitude: 16.8661,
    longitude: 107.5669,
    province: "Vietnam",
    category: "Country",
    level: "country",
  },
  // Provinces
  {
    id: "l_hanoi_prov",
    name: "Hà Nội",
    address: "Hà Nội, Vietnam",
    latitude: 21.0285,
    longitude: 105.8045,
    province: "Hà Nội",
    category: "Province",
    parentLocationId: "l0",
    level: "province",
  },
  {
    id: "l_danang_prov",
    name: "Đà Nẵng",
    address: "Đà Nẵng, Vietnam",
    latitude: 16.0544,
    longitude: 108.2022,
    province: "Đà Nẵng",
    category: "Province",
    parentLocationId: "l0",
    level: "province",
  },
  {
    id: "l_quangninh_prov",
    name: "Quảng Ninh",
    address: "Quảng Ninh, Vietnam",
    latitude: 20.9101,
    longitude: 107.1839,
    province: "Quảng Ninh",
    category: "Province",
    parentLocationId: "l0",
    level: "province",
  },
  {
    id: "l_quangnam_prov",
    name: "Quảng Nam",
    address: "Quảng Nam, Vietnam",
    latitude: 15.5747,
    longitude: 108.0367,
    province: "Quảng Nam",
    category: "Province",
    parentLocationId: "l0",
    level: "province",
  },
  {
    id: "l_laocai_prov",
    name: "Lào Cai",
    address: "Lào Cai, Vietnam",
    latitude: 22.3364,
    longitude: 103.8438,
    province: "Lào Cai",
    category: "Province",
    parentLocationId: "l0",
    level: "province",
  },
  // Districts/Areas
  {
    id: "l_hoankiem_dist",
    name: "Hoàn Kiếm",
    address: "Hoàn Kiếm District, Hà Nội",
    latitude: 21.0288,
    longitude: 105.8525,
    province: "Hà Nội",
    category: "District",
    parentLocationId: "l_hanoi_prov",
    level: "district",
  },
  {
    id: "l_banà_dist",
    name: "Ba Na Hills",
    address: "Ba Na Hills, Đà Nẵng",
    latitude: 15.9945,
    longitude: 107.9934,
    province: "Đà Nẵng",
    category: "District",
    parentLocationId: "l_danang_prov",
    level: "district",
  },
  {
    id: "l_halong_dist",
    name: "Hạ Long",
    address: "Hạ Long, Quảng Ninh",
    latitude: 20.9101,
    longitude: 107.1839,
    province: "Quảng Ninh",
    category: "District",
    parentLocationId: "l_quangninh_prov",
    level: "district",
  },
  {
    id: "l_hoian_dist",
    name: "Hội An",
    address: "Hội An, Quảng Nam",
    latitude: 15.8801,
    longitude: 108.338,
    province: "Quảng Nam",
    category: "District",
    parentLocationId: "l_quangnam_prov",
    level: "district",
  },
  {
    id: "l_sapa_dist",
    name: "Sa Pa",
    address: "Sa Pa, Lào Cai",
    latitude: 22.3364,
    longitude: 103.8438,
    province: "Lào Cai",
    category: "District",
    parentLocationId: "l_laocai_prov",
    level: "district",
  },
  // Landmarks
  {
    id: "l1",
    name: "Hoan Kiem Lake",
    address: "Hang Trong, Hoan Kiem, Ha Noi",
    latitude: 21.0288,
    longitude: 105.8525,
    province: "Ha Noi",
    category: "Lake",
    parentLocationId: "l_hoankiem_dist",
    level: "landmark",
  },
  {
    id: "l2",
    name: "Golden Bridge",
    address: "Ba Na Hills, Da Nang",
    latitude: 15.9945,
    longitude: 107.9934,
    province: "Da Nang",
    category: "Landmark",
    parentLocationId: "l_banà_dist",
    level: "landmark",
  },
  {
    id: "l3",
    name: "Ha Long Bay",
    address: "Ha Long, Quang Ninh",
    latitude: 20.9101,
    longitude: 107.1839,
    province: "Quang Ninh",
    category: "Nature",
    parentLocationId: "l_halong_dist",
    level: "landmark",
  },
  {
    id: "l4",
    name: "Hoi An Ancient Town",
    address: "Hoi An, Quang Nam",
    latitude: 15.8801,
    longitude: 108.338,
    province: "Quang Nam",
    category: "Heritage",
    parentLocationId: "l_hoian_dist",
    level: "landmark",
  },
  {
    id: "l5",
    name: "Terraced Fields Sa Pa",
    address: "Muong Hoa Valley, Sa Pa, Lao Cai",
    latitude: 22.3364,
    longitude: 103.8438,
    province: "Lao Cai",
    category: "Nature",
    parentLocationId: "l_sapa_dist",
    level: "landmark",
  },
]

export const POSTS: Post[] = [
  {
    id: "p1",
    author: USERS[1],
    location: LOCATIONS[0],
    content: "Golden hour at Hoan Kiem Lake never disappoints. The reflection of Thap Rua on the still water is absolutely magical. Best time to shoot is around 5:30-6:00 PM.",
    images: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&h=600&fit=crop",
    ],
    likesCount: 342,
    commentsCount: 28,
    savesCount: 89,
    isLiked: true,
    isSaved: false,
    createdAt: "2h ago",
    tags: ["golden_hour", "hanoi", "landscape"],
    photoTip: "Use a polarizing filter to reduce reflections and make the water surface mirror-like.",
  },
  {
    id: "p2",
    author: USERS[0],
    location: LOCATIONS[1],
    content: "The Golden Bridge emerging from the clouds this morning. I waited 3 hours for this shot but it was absolutely worth every second. The fog created a dreamy layer that separated the bridge from the valley below.",
    images: [
      "https://images.unsplash.com/photo-1557750255-c76072572da8?w=800&h=600&fit=crop",
    ],
    likesCount: 1205,
    commentsCount: 94,
    savesCount: 267,
    isLiked: false,
    isSaved: true,
    createdAt: "5h ago",
    tags: ["golden_bridge", "danang", "fog"],
    photoTip: "Arrive before 6 AM for the best fog. Use a telephoto lens (70-200mm) to compress the bridge perspective.",
  },
  {
    id: "p3",
    author: USERS[2],
    location: LOCATIONS[3],
    content: "Lantern streets of Hoi An at twilight. This ancient town transforms into a completely different world after sunset. The warm glow of hundreds of lanterns reflecting on the Thu Bon river.",
    images: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
    ],
    likesCount: 567,
    commentsCount: 45,
    savesCount: 134,
    isLiked: false,
    isSaved: false,
    createdAt: "1d ago",
    tags: ["hoian", "lanterns", "night_photography"],
    photoTip: "Shoot on a full moon night for extra ambient light. ISO 800-1600, f/2.8 works great.",
  },
  {
    id: "p4",
    author: USERS[4],
    location: LOCATIONS[4],
    content: "Rice terraces of Muong Hoa Valley in their full green glory. This is peak season and the layers of green stretching to the horizon are breathtaking. The H'mong farmers add such beautiful human elements to the landscape.",
    images: [
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop",
    ],
    likesCount: 891,
    commentsCount: 62,
    savesCount: 203,
    isLiked: true,
    isSaved: true,
    createdAt: "2d ago",
    tags: ["sapa", "terraces", "landscape"],
    photoTip: "Mid-morning light (8-10 AM) gives the best definition to the terrace layers. Use a wide angle lens.",
  },
  {
    id: "p5",
    author: USERS[3],
    location: LOCATIONS[2],
    content: "Sunrise cruise through Ha Long Bay. The limestone karsts appearing through the morning mist, fishermen heading out in their small boats. This is Vietnam at its most serene and timeless.",
    images: [
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop",
    ],
    likesCount: 2108,
    commentsCount: 156,
    savesCount: 445,
    isLiked: false,
    isSaved: false,
    createdAt: "3d ago",
    tags: ["halong", "sunrise", "seascape"],
    photoTip: "Book a boat that departs at 5 AM. The first light hits the karsts around 5:45 AM creating dramatic shadows.",
  },
]

export const COMMENTS: Comment[] = [
  {
    id: "c1",
    author: USERS[0],
    content: "Incredible shot! The lighting is perfect. What time exactly did you take this?",
    createdAt: "1h ago",
    likesCount: 12,
    isLiked: false,
    replies: [
      {
        id: "c1r1",
        author: USERS[1],
        content: "Thanks! It was around 5:45 PM, just as the sun touched the treeline.",
        createdAt: "45m ago",
        likesCount: 5,
        isLiked: true,
      },
    ],
  },
  {
    id: "c2",
    author: USERS[3],
    content: "This is why I keep coming back to Hoan Kiem. Every visit offers something new.",
    createdAt: "2h ago",
    likesCount: 8,
    isLiked: true,
  },
  {
    id: "c3",
    author: USERS[4],
    content: "The reflection game is strong here. Was it windy at all?",
    createdAt: "3h ago",
    likesCount: 3,
    isLiked: false,
  },
  {
    id: "c4",
    author: USERS[2],
    content: "Adding this to my must-shoot list for my Hanoi trip next month!",
    createdAt: "5h ago",
    likesCount: 6,
    isLiked: false,
  },
]

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "like",
    actor: USERS[1],
    message: "liked your post about Golden Bridge",
    postImage: "https://images.unsplash.com/photo-1557750255-c76072572da8?w=100&h=100&fit=crop",
    createdAt: "5m ago",
    isRead: false,
  },
  {
    id: "n2",
    type: "comment",
    actor: USERS[0],
    message: "commented on your photo: \"Incredible composition!\"",
    postImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=100&h=100&fit=crop",
    createdAt: "15m ago",
    isRead: false,
  },
  {
    id: "n3",
    type: "follow",
    actor: USERS[4],
    message: "started following you",
    createdAt: "1h ago",
    isRead: false,
  },
  {
    id: "n4",
    type: "checkin",
    actor: USERS[2],
    message: "checked in at Hoi An Ancient Town",
    postImage: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=100&h=100&fit=crop",
    createdAt: "2h ago",
    isRead: true,
  },
  {
    id: "n5",
    type: "like",
    actor: USERS[3],
    message: "liked your post about Sa Pa terraces",
    postImage: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=100&h=100&fit=crop",
    createdAt: "3h ago",
    isRead: true,
  },
  {
    id: "n6",
    type: "mention",
    actor: USERS[1],
    message: "mentioned you in a comment",
    createdAt: "5h ago",
    isRead: true,
  },
  {
    id: "n7",
    type: "follow",
    actor: USERS[0],
    message: "started following you",
    createdAt: "1d ago",
    isRead: true,
  },
  {
    id: "n8",
    type: "comment",
    actor: USERS[4],
    message: "replied to your comment: \"Totally agree!\"",
    postImage: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=100&h=100&fit=crop",
    createdAt: "1d ago",
    isRead: true,
  },
]

export const CHECKINS: CheckIn[] = [
  {
    id: "ci1",
    user: USERS[1],
    location: LOCATIONS[11],
    photo: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=400&fit=crop",
    note: "Another beautiful evening at the lake",
    createdAt: "2h ago",
  },
  {
    id: "ci2",
    user: USERS[2],
    location: LOCATIONS[14],
    photo: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=400&fit=crop",
    note: "Lantern festival vibes tonight!",
    createdAt: "5h ago",
  },
  {
    id: "ci3",
    user: USERS[4],
    location: LOCATIONS[15],
    photo: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=400&fit=crop",
    note: "Rice season at its peak",
    createdAt: "1d ago",
  },
]

export const CURRENT_USER: User = {
  id: "u_me",
  username: "photoscout_vn",
  firstName: "Anh",
  lastName: "Photographer",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  bio: "Vietnam through my lens | Landscape & Street | Based in HCMC",
  followersCount: 1280,
  followingCount: 340,
  postsCount: 67,
  isFollowing: false,
  level: "Pro Scout",
}

export function getAllUsers() {
  return USERS
}

export function getPostById(id: string) {
  return POSTS.find((p) => p.id === id)
}

export function getUserById(id: string) {
  if (id === "u_me") return CURRENT_USER
  return USERS.find((u) => u.id === id)
}

export function getLocationById(id: string) {
  return LOCATIONS.find((l) => l.id === id)
}

export function getLocationHierarchy(locationId: string): Location[] {
  const hierarchy: Location[] = []
  let current = getLocationById(locationId)

  while (current) {
    hierarchy.unshift(current)
    if (current.parentLocationId) {
      current = getLocationById(current.parentLocationId)
    } else {
      break
    }
  }

  return hierarchy
}

export function getChildLocations(parentLocationId: string): Location[] {
  return LOCATIONS.filter((l) => l.parentLocationId === parentLocationId)
}

export function getPostsByLocation(locationId: string, includeSubLocations: boolean = true): Post[] {
  const location = getLocationById(locationId)
  if (!location) return []

  if (includeSubLocations) {
    const locationIds = new Set<string>()
    locationIds.add(locationId)

    const addChildren = (parentId: string) => {
      const children = getChildLocations(parentId)
      children.forEach((child) => {
        locationIds.add(child.id)
        addChildren(child.id)
      })
    }

    addChildren(locationId)

    return POSTS.filter((p) => locationIds.has(p.location.id))
  } else {
    return POSTS.filter((p) => p.location.id === locationId)
  }
}

export function getParentLocation(locationId: string): Location | undefined {
  const location = getLocationById(locationId)
  if (!location || !location.parentLocationId) return undefined
  return getLocationById(location.parentLocationId)
}
