package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/ClickHouse/clickhouse-go"
	"github.com/chromedp/chromedp"
	"github.com/geziyor/geziyor"
	"github.com/geziyor/geziyor/client"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"strings"
)

type WProduct struct {
	PageType string
	Ptype []string
	Pbrand string
	ProdID []uint
	Value []string
	Discount string
	Delivery string
}

type Product struct {
	Name string
	Brand string
	ID uint
	Price uint
	Discount string
	Delivery string
}

func main() {

	connect, err := sql.Open("clickhouse", "tcp://127.0.0.1:9900?debug=true")
	if err != nil {
		log.Fatal(err)
	}
	if err := connect.Ping(); err != nil {
		if exception, ok := err.(*clickhouse.Exception); ok {
			fmt.Printf("[%d] %s \n%s\n", exception.Code, exception.Message, exception.StackTrace)
		} else {
			fmt.Println(err)
		}
		return
	}

	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	var res string

	err = chromedp.Run(ctx,
		chromedp.Navigate(`https://www.wildberries.ru/catalog/18840845/detail.aspx`),
		chromedp.Click("#a-Comments", chromedp.ByQuery),
		chromedp.WaitVisible(`.comment`),
		chromedp.OuterHTML("body", &res, chromedp.ByQuery),
		//chromedp.OuterHTML("#content", &outerAfter, chromedp.ByQuery),
	)

	if err != nil {
		fmt.Println(err)
	}

	err = ioutil.WriteFile("var/index.html", []byte(res), 0)

	if err != nil {
		fmt.Println(err.Error())
	}
}

func parseMovies(g *geziyor.Geziyor, r *client.Response) {

	//rePageType := regexp.MustCompile(`"PageType":.*"?`)
	reProductType := regexp.MustCompile(`(?s)google_tag_params = {.*?}`)
	result := reProductType.Find(r.Body)
	jsonData := strings.Replace(string(result), "google_tag_params = ", "", 1)

	wp := WProduct{}

	json.Unmarshal([]byte(jsonData), &wp)

	price, _ := strconv.Atoi(wp.Value[0])

	p := Product{
		Name: wp.Ptype[0],
		Brand: wp.Pbrand,
		ID: wp.ProdID[0],
		Discount: wp.Discount,
		Delivery: wp.Delivery,
		Price:  uint(price),
	}


	fmt.Println(p)
}