require('dotenv').config();

module.exports = {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://aayush:1234512345@localhost:5432/ecosmart',
  },
};
