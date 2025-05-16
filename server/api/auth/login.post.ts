export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Username and password are required'
    })
  }

  // Fake users database
  const users = {
    'admin': {
      password: 'admin*101010',
      id: 1,
      name: 'Admin User',
      role: 'admin'
    },
    'cajero': {
      password: 'cajero123', 
      id: 2,
      name: 'Cajero User',
      role: 'cashier'
    },
    'manager': {
      password: 'manager123',
      id: 3,
      name: 'Manager User',
      role: 'manager'
    }
  }

  const user = users[body.username as keyof typeof users]

  // Validate user and password
  if (user && user.password === body.password) {
    return {
      user: {
        id: user.id,
        username: body.username,
        name: user.name,
        role: user.role
      },
      token: `fake-jwt-token-${user.id}`
    }
  }

  // Invalid credentials
  throw createError({
    statusCode: 401,
    message: 'Invalid username or password'
  })
})
