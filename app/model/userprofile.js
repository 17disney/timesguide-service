'use strict'

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize
  const SEX_TAG = {
    UNKNOWN: 0,
    MALE: 1,
    FEMALE: 2
  }

  const Userprofile = app.model.define('userprofile', {
    sex: {
      type: INTEGER,
      defaultValue: SEX_TAG.UNKNOWN
    },
    city: STRING(32),
    province: STRING(32),
    country: STRING(32),
    aboutMe: STRING(255),
    birthday: STRING(20)
  })
  Userprofile.associate = function() {
    app.model.Userprofile.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }
  return Userprofile
}
