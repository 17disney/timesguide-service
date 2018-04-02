module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN } = app.Sequelize

  const Voucher = app.model.define(
    'ds_voucher',
    {
      uid: {
        type: INTEGER
      },
      type: INTEGER,
      valid_at: STRING
    },
    {
      indexes: [
        {
          fields: ['uid']
        }
      ]
    }
  )
  return Voucher
}
