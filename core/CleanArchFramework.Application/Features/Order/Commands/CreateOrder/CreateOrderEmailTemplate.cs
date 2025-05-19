namespace CleanArchFramework.Application.Features.Order.Commands.CreateOrder
{
    public static class CreateOrderEmailTemplate {      
            public static string Generate(CreateOrderCommand request)
            {
                string emailContent =
                    $@"
        <!DOCTYPE html>
        <html lang=""en"">
        <head>
            <meta charset=""UTF-8"">
            <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
            <title>{(request.IsOrder ? "Order" : "Request")} details</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #fff;
                }}
                h1, h2, h3, h4, h5, h6 {{
                    margin-top: 0;
                }}
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }}
                th {{
                    background-color: #f2f2f2;
                }}
            </style>
        </head>
        <body>
            <div class=""container"">
                <h2>{(request.IsOrder ? "Order" : "Request")} details.</h2>
                <p>Dear {request.Name},</p>
                <p>Thank you for your recent {(request.IsOrder ? "order" : "request")} with us. Below are the details of your {(request.IsOrder ? "order" : "request")}:</p>
                <h3 class=""is-order-heading""> This is: <b> {(request.IsOrder ? "ORDER" : "REQUEST")} </b></h3>
                <div class=""customer-info"">
                    <h3>Customer Information:</h3>
                    <ul>
                       
                      <li><strong>Company:</strong> {request.Company}</li>
                        <li><strong>Name:</strong> {request.Name}</li>
                      <li><strong>Street:</strong> {request.Street}</li>
                        <li><strong>Zip:</strong> {request.Zip}</li>
                         <li><strong>Email:</strong> {request.Email}</li>
                        <li><strong>Phone:</strong> {request.Phone}</li>
                    </ul>
                </div>";

                if (request.IsDifferentAddress)
                {
                    emailContent += $@"
                <div class=""shipping-info"">
                    <h3>Shipping Information:</h3>
                    <ul>                
                        <li><strong>Company:</strong> {request.ShippingCompany}</li>
                        <li><strong>Country:</strong> {request.ShippingCountry}</li>
                        <li><strong>Name:</strong> {request.ShippingName}</li>
                        <li><strong>Street:</strong> {request.ShippingStreet}</li>
                        <li><strong>Zip:</strong> {request.ShippingZip}</li>                      
                    </ul>
                </div>";
                }
                else
                {
                    emailContent += $@"
                 <div class=""shipping-info"">
                      <h3>Shipping Information: Same address</h3>
                 </div>";
                }

                emailContent += $@"
               <div class=""order-details"">
                    <h3>Request Details:</h3>
                    <ul>
                        <li><strong>Description:</strong> {request.Description}</li> ";
                if (!request.IsOrder)
                {
                    emailContent += $@"
                        <li><strong>Packing cost:</strong> <b> {(request.PackagingCostNeeded ? "Yes" : "No")}</li>    
                        <li><strong>Shipping cost:</strong><b> {(request.ShippingCostNeeded ? "Yes" : "No")}</li>"
                        ;
                }
                emailContent += $@" </ul>
                </div>
                <div class=""ordered-items"">
                    <h3>Items:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Valve</th>
                                <th>Sleeve</th>
                                <th>Spare Part</th>
                                <th>Quantity</th>
                                <th>Item Description</th>
                            </tr>
                        </thead>
                        <tbody>";

                // Add ordered items to email content
                foreach (var item in request.OrderedItems)
                {
                    emailContent += $@"
                            <tr>
                                <td>{item.Valve}</td>
                                <td>{item.Sleeve}</td>
                                <td>{item.SparePart}</td>
                                <td>{item.Quantity}</td>
                                <td>{item.ItemDescription}</td>
                            </tr>";
                }

                // Add closing remarks
                emailContent += $@"
                                </tbody>
                            </table>
                        </div>
                        <p>If you have any questions or concerns regarding your {(request.IsOrder ? "order" : "request")}, feel free to reach out to us. Thank you for choosing us, and we look forward to serving you again soon.</p>
                        <p>Best regards,<br>HO-Matic Team</p>
                    </div>
                </body>
                   </html>";
                return emailContent;
            }
        }
    }



