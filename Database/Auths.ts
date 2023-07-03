import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from ".";

export class Auths extends Model {
    declare id: number;
    declare bot: string;
    declare user: string;
    declare guild: string;
    declare locale: string;
    declare access_token: string;
    declare refresh_token: string
    declare userInformationsFailed: number;
    declare refreshFailed: number;
    declare expires_in: number;
    declare scope: string;
    declare token_type: string;
    declare expireDate: Date;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Auths.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bot: {
        type: DataTypes.BIGINT({ length: 32 }),
        allowNull: false
    },
    user: {
        type: DataTypes.BIGINT({ length: 32 }),
        allowNull: false
    },
    guild: {
        type: DataTypes.BIGINT({ length: 32 }),
        allowNull: true
    },
    locale: {
        type: DataTypes.STRING({ length: 7 }),
        allowNull: false
    },
    access_token: {
        type: DataTypes.STRING({ length: 32 }),
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING({ length: 32 }),
        allowNull: false
    },
    userInformationsFailed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    refreshFailed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    expires_in: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    scope: {
        type: DataTypes.STRING({ length: 32 }),
        allowNull: false
    },
    token_type: {
        type: DataTypes.STRING({ length: 32 }),
        allowNull: false
    },
    expireDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: sequelizeInstance
});

export default Auths;