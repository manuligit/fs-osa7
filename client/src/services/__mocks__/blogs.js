let token = null

const blogs = [
  {
    id: "agsjifsa18231",
    title: "Kissojen maailma",
    author: "Mikko Mallikas",
    url: "http:www.fi",
    likes: 3,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mikkoalatalo",
      name: "Mikko Alatalo"
    }
  },
  {
    id: "agsjifsa124211",
    title: "Tärkeä artikkeli - katso kuvat",
    author: "Kalle Kurki",
    url: "http:www.fi",
    likes: 0,
    user: {
      _id: "551u214sad484",
      username: "kallekurki",
      name: "Kalle Kurki"
    }
  },  
  {
    id: "a421fsa18231",
    title: "Viirus linkki älä avaa",
    author: "Veera Varoitus",
    url: "http:www.fi",
    likes: 10,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mikkoalatalo",
      name: "Mikko Alatalo"
    }
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll, blogs }