module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const Exchange = app.model.define(
    'exchanges',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      type: {
        type: INTEGER,
        allowNull: false
      },
      // tid: {
      //   type: STRING(255),
      //   allowNull: false
      // },
      userid: {
        type: STRING(255),
        allowNull: false
      },
      targetid: {
        type: STRING(255),
        allowNull: false
      },
      status: {
        type: INTEGER,
        allowNull: false
      }
    }
    // {
    //   indexes: [
    //     {
    //       fields: ['userid']
    //     }
    //   ]
    // }
  )

  Exchange.associate = function() {
    app.model.Exchange.belongsTo(app.model.Timesguide, {
      as: 'timesguides',
      foreignKey: 'tid'
    })
  }

  return Exchange
}
