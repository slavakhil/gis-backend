var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
let TeamMember = class TeamMember {
    id;
    position;
    lastName;
    firstName;
    patronymic;
    email;
    photo;
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], TeamMember.prototype, "id", void 0);
__decorate([
    Property({ type: 'text' }),
    __metadata("design:type", String)
], TeamMember.prototype, "position", void 0);
__decorate([
    Property({ fieldName: 'last_name', type: 'text' }),
    __metadata("design:type", String)
], TeamMember.prototype, "lastName", void 0);
__decorate([
    Property({ fieldName: 'first_name', type: 'text' }),
    __metadata("design:type", String)
], TeamMember.prototype, "firstName", void 0);
__decorate([
    Property({ fieldName: 'patronymic', type: 'text', nullable: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "patronymic", void 0);
__decorate([
    Property({ fieldName: 'email', type: 'text' }),
    __metadata("design:type", String)
], TeamMember.prototype, "email", void 0);
__decorate([
    Property({ fieldName: 'photo', nullable: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "photo", void 0);
TeamMember = __decorate([
    Entity({ tableName: 'team_members' })
], TeamMember);
export { TeamMember };
