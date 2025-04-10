var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { File } from './file.entity.js';
let News = class News {
    id;
    date;
    author;
    content;
    image;
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], News.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", Date)
], News.prototype, "date", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], News.prototype, "author", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], News.prototype, "content", void 0);
__decorate([
    ManyToOne(() => File, { nullable: true }),
    __metadata("design:type", File)
], News.prototype, "image", void 0);
News = __decorate([
    Entity({ tableName: 'news' })
], News);
export { News };
