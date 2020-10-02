const db = require('./db')

class Restaurant {
    constructor(data) {
        const restaurant = this
        restaurant.id = data.id
        restaurant.name = data.name
        restaurant.image = data.image
        restaurant.menus = []

        if (restaurant.id) {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM menus WHERE restaurant_id=?;', [restaurant.id], (err, rows) => {
                    const arrayOfPromises = rows.map(row => new Menu(row))
                    Promise.all(arrayOfPromises)
                        .then(menus => {
                        restaurant.menus = menus
                        resolve(restaurant)
                    }).catch(err => reject(err))
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO restaurants(name, image) VALUES(?,?);', [restaurant.name, restaurant.image], function (err) {
                    if (err) return reject(err)
                    restaurant.id = this.lastID
                    return resolve(restaurant)
                })
            })
        }
    }
    async addMenu(data) {
        const menu = await new Menu({name: data.name, restaurant_id: this.id})
        this.menus.push(menu)
    }
}

class Menu {
    constructor(data) {
        const menu = this
        menu.id = data.id
        menu.name = data.name
        menu.image = data.image
        menu.restaurant_id = data.restaurant_id
        menu.items = []

        if (menu.id) {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM items WHERE menu_id=?;', [menu.id], (err, rows) => {
                    const arrayOfPromises = rows.map(row => new Item(row))
                    Promise.all(arrayOfPromises)
                        .then(items => {
                        menu.items = items
                        resolve(menu)
                    }).catch(err => reject(err))
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO menus(name, image, restaurant_id) VALUES(?,?,?);', [menu.name, menu.image, menu.restaurant_id], function (err) {
                    if (err) return reject(err)
                    menu.id = this.lastID
                    return resolve(menu)
                })
            })
        }
    }
    async addItem(data) {
        const item = await new Item({name: data.name, menu_id: this.id})
        this.items.push(item)
    }
}

class Item {
    constructor(data) {
        const item = this
        item.id = data.id
        item.name = data.name
        item.image = data.image
        item.menu_id = data.menu_id

        if (item.id) {
            return Promise.resolve(item)
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO items(name, image, menu_id) VALUES(?,?,?);', [item.name, item.image, item.menu_id], function (err) {
                    if (err) return reject(err)
                    item.id = this.lastID
                    return resolve(item)
                })
            })
        }
    }
}

module.exports = {Restaurant, Menu, Item}