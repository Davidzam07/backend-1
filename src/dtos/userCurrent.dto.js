export class UserCurrentDTO {
  constructor(userDoc) {
    this._id = userDoc._id;
    this.first_name = userDoc.first_name;
    this.last_name = userDoc.last_name;
    this.email = userDoc.email;
    this.age = userDoc.age;
    this.role = userDoc.role;
    this.cart = userDoc.cart ?? null;
  }
}

