module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define("History", {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    player_choice: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    com_choice: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    player_result: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  History.associate = (models) => {
    History.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return History;
};
