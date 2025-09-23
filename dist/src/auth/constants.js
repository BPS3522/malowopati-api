"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.IS_PUBLIC_KEY = exports.refreshJwtConstants = exports.jwtConstants = void 0;
const common_1 = require("@nestjs/common");
exports.jwtConstants = {
    secret: 'AKU CINTA BPS KAB. BOJONEGORO',
};
exports.refreshJwtConstants = {
    secret: 'SEMOGA AKU BISA BEKERJA DI SANA',
};
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
//# sourceMappingURL=constants.js.map