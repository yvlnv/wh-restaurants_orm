const {Restaurant, Menu, Item} = require('./models')
const db = require('./db')

describe('Restaurants', () => {
    beforeAll((done) => {
        db.exec('CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT, image TEXT);')
        db.exec('CREATE TABLE menus(id INTEGER PRIMARY KEY, name TEXT, image TEXT, restaurant_id INTEGER);')
        db.exec('CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, image TEXT, menu_id INTEGER);', done)
    })
    test('when a restaurant is created it is added to the db', async () => {
        const restaurant = await new Restaurant({name: 'Zima', image: 'image.url'})
        expect(restaurant.id).toBe(1)
    })
    test('create a restaurant for the data row', async () => {
        db.get('SELECT * FROM restaurants WHERE id = 1;', async (err, row) => {
            expect(row.name).toBe('Zima')
            const restaurant = await new Restaurant(row)
            expect(restaurant.id).toBe(1)
            expect(restaurant.name).toBe('Zima')
        })
    })
    test('restaurant has menus', async (done) => {
        const restaurant = await new Restaurant({name: "Rice-n-Pot", image: "url"})
        expect(restaurant.menus.length).toBe(0)
        await restaurant.addMenu({name: "Dessert"})
        expect(restaurant.menus[0] instanceof Menu).toBeTruthy()
        expect(restaurant.menus[0].id).toBeTruthy()
        await restaurant.addMenu({name: "Child's menu"})
        await restaurant.addMenu({name: "Mains"})
        db.get('SELECT * FROM restaurants WHERE id=?;', [restaurant.id], async (err, row) => {
            const ricenpot = await new Restaurant(row)
            expect(ricenpot.id).toBe(restaurant.id)
            expect(ricenpot.menus.length).toBe(3)
            done()
        })
    })
})

describe('Menus', () => {
    test('when menu is created it is added to the db', async () => {
        const menu = await new Menu({name: 'Mains', image: 'image.url', restaurant_id: 1})
        expect(menu.id).toBe(4)
    })
    test('create menu for the data row', async () => {
        db.get('SELECT * FROM menus WHERE id = 1;', async (err, row) => {
            expect(row.name).toBe('Dessert')
            const menu = await new Menu(row)
            expect(menu.id).toBe(1)
            expect(menu.name).toBe('Dessert')
        })
    })
    test('check that menu belongs to restaurant', async () => {
        const menu = await new Menu({name: 'Lunch', image: 'image.url', restaurant_id: 3})
        const restaurant = await new Restaurant({name: 'Nenno', image: 'image.url'})
        expect(menu.restaurant_id).toBe(restaurant.id)
    })
    test('check that menu is deleted', async (done) => {
        const menu = await new Menu({name: 'Drinks', image: 'image.url', restaurant_id: 1})
        db.exec('DELETE FROM menus WHERE name="Drinks" AND restaurant_id=1;', () => {
            db.get('SELECT * FROM menus WHERE name="Drinks";', async (err, rows) => {
                expect(rows).toBeFalsy()
                done()
            })
        })
    })
    test('check that menu image is updated', async (done) => {
        const menu = await new Menu({name: 'Drinks', image: 'image.url', restaurant_id: 1})
        db.exec('UPDATE menus SET image="pop" WHERE name="Drinks";', () => {
            db.get('SELECT * FROM menus WHERE name="Drinks";', async (err, rows) => {
                expect(rows.image).toBe("pop")
                done()
            })
        })
    })
    test('menu has items', async (done) => {
        const menu = await new Menu({name: "Vegetarian", image: "url"})
        expect(menu.items.length).toBe(0)
        await menu.addItem({name: "Vegetable Lasagna"})
        expect(menu.items[0] instanceof Item).toBeTruthy()
        expect(menu.items[0].id).toBeTruthy()
        await menu.addItem({name: "Sweet Potato Cake"})
        await menu.addItem({name: "Bean and Halloumi Stew"})
        db.get('SELECT * FROM menus WHERE id=?;', [menu.id], async (err, row) => {
            const veg = await new Menu(row)
            expect(veg.id).toBe(menu.id)
            expect(veg.items.length).toBe(3)
            done()
        })
    })
})

describe('Items', () => {
    test('when an item is created it is added to the db', async () => {
        const item = await new Item({name: 'Pizza Margherita', image: 'image.url', menu_id: 1})
        expect(item.id).toBe(4)
    })
    test('create item for the data row', async () => {
        db.get('SELECT * FROM items WHERE id = 4;', async (err, row) => {
            expect(row.name).toBe('Pizza Margherita')
            const pizza = await new Item(row)
            expect(pizza.id).toBe(4)
            expect(pizza.name).toBe('Pizza Margherita')
        })
    })
    test('check that item belongs to a restaurant', async () => {
        const menu = await new Menu({name: 'Salads', image: 'image.url', restaurant_id: 1})
        const item = await new Item({name: 'Caesar Salad', image: 'image.url', menu_id: 8})
        expect(item.menu_id).toBe(menu.id)
    })
})