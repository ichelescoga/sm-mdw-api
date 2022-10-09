const util = require('util')
const { smConnection } = require('../components/RegularConnection')
const query = util.promisify(smConnection.query).bind(smConnection)

let CouponRepository = function () {

    let getStockProducts = async () => {
        try{    
            let result = await query(`
            select
                a.ID,
                a.post_title,
                a.post_name abreviature, 
                a.post_excerpt,
                b.meta_value as sku,
                c.meta_value as imagen,
                CONCAT('https://sanmartinbakery.com/producto/',b.meta_value) as url,
                b.meta_value as product_id,
                d.meta_value as stock,
                e.meta_value as price
            from sanmartinmts.wp_posts a
            join sanmartinmts.wp_postmeta b on a.ID = b.post_id
            join sanmartinmts.wp_postmeta c on a.ID = c.post_id
            join sanmartinmts.wp_postmeta d on a.ID = d.post_id
            join sanmartinmts.wp_postmeta e on a.ID = e.post_id
            join sanmartinmts.wp_postmeta f on a.ID = f.post_id
            join sanmartinmts.wp_postmeta g on a.ID = g.post_id
            where a.post_type = 'product' and b.meta_key = '_sku' and c.meta_key = 'image_desktop'
            and d.meta_key = '_stock_status' and d.meta_value = 'instock' and e.meta_key = '_regular_price'
            and f.meta_key = 'available' and f.meta_value = 1 and g.meta_key = 'purchasable' and g.meta_value = 1;`);
            return result
        }
        catch(error){
            console.error(error)
            throw error
        }
    }

    return {
        getStockProducts,
        
    }

}
module.exports = CouponRepository();