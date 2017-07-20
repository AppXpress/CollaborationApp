module.exports = {
    get Button() { return require('./src/Button').default },
    get Card() { return require('./src/Card').default },
    get ComplexText() { return require('./src/ComplexText').default },
    get Field() { return require('./src/Field').default },
    get Icon() { return require('./src/Icon').default },
    get ListItem() { return require('./src/ListItem').default },
    get Loading() { return require('./src/Loading').default },
    get Modal() { return require('./src/Modal').default },
    get Navigation() { return require('./src/Navigation') },
    get Page() { return require('./src/Page').default },
    get Picker() { return require('./src/Picker').default },
    get Switch() { return require('./src/Switch').default },
    get Tag() { return require('./src/Tag').default },
    get TextInput() { return require('./src/TextInput').default },

    get helpers() { return require('./helpers') }
};
