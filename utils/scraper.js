import https from 'https';
import fs from 'fs';
import cheerio from 'cheerio';


const fetchInterships=(page_num)=> {
  const req = https.request({
    hostname: 'internshala.com',
    path: '/internships/work-from-home-web-development-internships/stipend-4000' + (page_num > 1 ? '/page-' + page_num : '') ,
    method: 'GET'
  }, (res) => {
    let responseData = '';
  
    res.on('data', (chunk) => {
      responseData += chunk;
    });
  
    res.on('end', () => {
      const $ = cheerio.load(responseData);
      const dataArr = [];
      $('div[internshipid]').each((i, el) => {
          let company = $(el).find('.view_detail_button')
          const data ={
              id: parseInt($(el).attr('internshipid')),
              title: company.first().text().trim(),
              company: $(el).find('.link_display_like_text').text().trim(),
              company_logo:'https://internshala.com' + $(el).find(".internship_logo img").attr('src') ?? null ,
              location: $(el).find('.location_link').text().trim(),
              duration: $(el).find('.item_body').first().text().trim(),
              link: 'https://internshala.com' + company.attr('href'),            
              stipend: $(el).find('.item_body').last().text().trim(),
              other_info: $(el).find('.other_label_container .status').map(function () {
                return $(this).text();
              }).get()
          }
          dataArr.push(data)
         
      });
      console.log({
        status: 200,
        current_page: parseInt($('#pageNumber').text().trim()),
        total_pages: parseInt($('#total_pages').text().trim()),
        data: dataArr
      })
      fs.writeFile('data.json', JSON.stringify({
        status: 200,
        current_page: parseInt($('#pageNumber').text().trim()),
        total_pages: parseInt($('#total_pages').text().trim()),
        data: dataArr
      }), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
     
      // if (parseInt($('#pageNumber').text().trim()) < parseInt($('#total_pages').text().trim())) {
      //   fetchInterships(parseInt($('#pageNumber').text().trim()) + 1)
      // }

    });
  });
  
  req.on('error', (error) => {
    console.error(error);
  });
  
  req.end();
}

export default fetchInterships;


