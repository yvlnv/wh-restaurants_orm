const {Restaurant, Menu, Item} = require('./models')
const db = require('./db')

describe('Restaurants', () => {
    beforeAll((done) => {
        db.exec('CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT, image TEXT);', done)
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
})

describe('Menus', () => {
    beforeAll((done) => {
        db.exec('CREATE TABLE menus(id INTEGER PRIMARY KEY, name TEXT, image TEXT, restaurant_id INTEGER);', done)
    })
    test('when menu is created it is added to the db', async () => {
        const menu = await new Menu({name: 'Mains', image: 'image.url', restaurant_id: 1})
        expect(menu.id).toBe(1)
    })
    test('create menu for the data row', async () => {
        db.get('SELECT * FROM menus WHERE id = 1;', async (err, row) => {
            expect(row.name).toBe('Mains')
            const menu = await new Menu(row)
            expect(menu.id).toBe(1)
            expect(menu.name).toBe('Mains')
        })
    })
    test('check that menu belongs to restaurant', async () => {
        const menu = await new Menu({name: 'Lunch', image: 'image.url', restaurant_id: 2})
        const restaurant1 = await new Restaurant({name: 'Nenno', image: 'image.url'})
        expect(menu.restaurant_id).toBe(restaurant1.id)
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
})

describe('Items', () => {
    beforeAll((done) => {
        db.exec('CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, image TEXT, menu_id INTEGER);', done)
    })
    test('when an item is created it is added to the db', async () => {
        const item = await new Item({name: 'Pizza Margherita', image: 'image.url', menu_id: 1})
        expect(item.id).toBe(1)
    })
    test('create item for the data row', async () => {
        db.get('SELECT * FROM items WHERE id = 1;', async (err, row) => {
            expect(row.name).toBe('Pizza Margherita')
            const pizza = await new Item(row)
            expect(pizza.id).toBe(1)
            expect(pizza.name).toBe('Pizza Margherita')
        })
    })
    test('check that item belongs to a restaurant', async () => {
        const menu = await new Menu({name: 'Salads', image: 'image.url', restaurant_id: 1})
        const item = await new Item({name: 'Caesar Salad', image: 'image.url', menu_id: 4})
        expect(item.menu_id).toBe(menu.id)
    })
})