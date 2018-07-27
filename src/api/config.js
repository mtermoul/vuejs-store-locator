const config = {
    bucket: {
        slug: process.env.COSMIC_BUCKET || 'store-locator',
        read_key: process.env.COSMIC_READ_KEY,
        write_key: process.env.COSMIC_WRITE_KEY
    },
    object_type: 'cities'
}

export default config
