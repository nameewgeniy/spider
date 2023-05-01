package main

import (
	"context"
	"github.com/chromedp/chromedp"
	"log"
	"spider/internal/parser/env"
	"time"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}


func run() error {

	config, err := env.Load()
	
	if err != nil {
		return err
	}
	
	ctx, cancel := context.WithTimeout(context.Background(), 20 * time.Second)
	defer cancel()
	
	allocatorContext, cancel := chromedp.NewRemoteAllocator(ctx, config.ChromedpHost)
	defer cancel()

	// create context
	ctx, cancel = chromedp.NewContext(allocatorContext)
	defer cancel()

	var res string

	err = chromedp.Run(ctx,
		chromedp.Navigate(`https://dzen.ru/news/story/Soshedshij_srelsov_vBryanskoj_oblasti_poezd_perevozil_toplivo_i_stroitelnye_materialy--9fb8076917845c3f9752c719bbdf718c?lang=ru&from=main_portal&fan=1&stid=LVN6a6xviJ1ylzvRyUJ_&t=1682932041&persistent_id=2712965939&story=b06d4776-586d-5ccc-bb15-028e4aaf84fa&issue_tld=ru&utm_referrer=dzen.ru`),
		chromedp.OuterHTML("body", &res, chromedp.ByQuery),
	)
	
	println(res)

	return err
}
