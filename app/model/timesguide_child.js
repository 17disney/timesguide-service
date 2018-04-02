module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN } = app.Sequelize

  const Timesguide = app.model.define('ds_timesguide_child', {
    tid: {
      type: INTEGER,
      allowNull: false
    },
    uid: {
      type: INTEGER,
      allowNull: false
    },
    status: {
      type: INTEGER,
      defaultValue: 0
    }
  })
  return Timesguide
}
