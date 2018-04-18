const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize

  const User = app.model.define(
    'user',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      name: {
        type: STRING(32),
        allowNull: false
      },
      email: {
        type: STRING(60),
        validate: {
          isEmail: true
        }
      },
      phoneNumber: {
        type: STRING(255)
      },
      avatar: {
        type: STRING(255),
        validate: {
          isUrl: true
        }
      },
      password: {
        type: STRING(60),
        validate: {
          len: [6, 60]
        }
      },
      status: {
        type: INTEGER,
        defaultValue: 1
      },
      level: {
        type: INTEGER,
        defaultValue: 0
      },
      mark: {
        type: INTEGER,
        defaultValue: 50
      },
      exchange: {
        type: INTEGER,
        defaultValue: 0
      },
      contribute: {
        type: INTEGER,
        defaultValue: 0
      },
      collection: {
        type: INTEGER,
        defaultValue: 0
      }
    },
    {
      indexes: [
        {
          fields: ['name']
        },
        {
          fields: ['email']
        }
      ]
      // instanceMethods: {
      //   comparePassword(candidatePassword, callback) {
      //     bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      //       if (err) {
      //         return callback(err)
      //       }
      //       callback(null, isMatch)
      //     })
      //   }
      // }
    }
  )

  // User.beforeCreate((user, options, fn) => {
  //   bcrypt.genSalt(10, (err, salt) => {
  //     if (err) {
  //       console.log('Error while generating bcrypt salt.')
  //       console.log(err)
  //       fn(err, null)
  //       return
  //     }

  //     bcrypt.hash(user.password, salt, null, (err, hash) => {
  //       if (err) {
  //         console.log('Error while generating bcrypt hash.')
  //         console.log(err)
  //         fn(err, null)
  //         return
  //       }
  //       user.password = hash
  //       fn(null, user)
  //       return user
  //     })
  //   })
  // })

  return User
}
