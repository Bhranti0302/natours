const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Natours API',
      version: '1.0.0',
      description: 'API documentation for the Natours travel booking application',
    },

    servers: [
      {
        url: 'https://natours-zyht.onrender.com',
        description: 'Production server',
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
        },
      },
    },
  },

  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
