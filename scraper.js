import https from 'https';
import fs from 'fs';
import cheerio from 'cheerio';
import storeData from './utils/storeData.js';


const fetchInterships=(page_num, min_stipend)=> {
  const req = https.request({
    hostname: 'internshala.com',
    path: '/internships/work-from-home-web-development-internships/stipend-' + min_stipend +(page_num > 1 ? '/page-' + page_num : '') ,
    method: 'GET'
  }, (res) => {
    let responseData = '';
  
    res.on('data', (chunk) => {
      responseData += chunk;
    });
  
    res.on('end', () => {
      const $ = cheerio.load(responseData);
      console.log('Fetching page ' + page_num + ' of ' + $('#total_pages').text().trim())
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
          dataArr.push(data)  // can alo pass a local file path to storeData
         
      });

      // Store the data in a JSON file 
      storeData(dataArr)

      if (parseInt($('#pageNumber').text().trim()) < parseInt($('#total_pages').text().trim())) {
        fetchInterships(parseInt($('#pageNumber').text().trim()) + 1)
      }

    });
  });
  
  req.on('error', (error) => {
    console.error(error);
  });
  
  req.end();
}

fetchInterships(1, 10000)


