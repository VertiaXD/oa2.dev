import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from ".";

export class Admins extends Model {
    declare id: number;
}

Admins.init({
    id: {
        type: DataTypes.BIGINT({ length: 32 }),
        primaryKey: true
    }
}, {
    sequelize: sequelizeInstance,
    timestamps: false
});

export default Admins;