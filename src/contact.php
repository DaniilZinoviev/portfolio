<?php

class Contact {

    /**
     * @var array
     */
    protected $result;

    /**
     * Constructor
     *
     * @param array $request
     */
    public function __construct(array $request)
    {
        $name       = (string) strip_tags($request['name']);
        $email      = (string) strip_tags($request['email']);
        $message    = (string) strip_tags($request['message']);

        $errors = $this->validate($name, $email, $message);

        if (!empty($errors)) {
            $this->result = [
                'success' => false,
                'message' => trim(implode('; ', $errors))
            ];
            return;
        }

        $result = $this->send($name, $email, $message);

        if ($result) {
            $this->result = [
                'success' => true,
                'message' => 'The message has been successfully sent to delivery'
            ];
        } else {
            $this->result = [
                'success' => false,
                'message' => 'The message has been declined by delivery'
            ];
        }
    }

    /**
     * Validate input data
     *
     * @param string $name
     * @param string $email
     * @param string $message
     */
    public function validate(string $name, string $email, string $message)
    {
        $errors = [];

        if (! $name || ! $email || ! $message) {
            $errors[] = 'Error: not enough fields has been submitted!';
        }

        return $errors;
    }
    
    /**
     * Sends an email to the site owner
     *
     * @param string $name
     * @param string $email
     * @param string $message
     */
    public function send(string $name, string $email, string $message)
    {
        $to      = 'danzino21@gmail.com';
        $subject = 'Contact form from the danzino.com';
        $message = "Name: $name\n\nEmail: $email\n\nMessage:\n$message";
        $headers = 'From: danzino.com' . "\r\n" .
            'Reply-To: danzino.com' . "\r\n" .
            'X-Mailer: PHP/' . phpversion();

        return mail($to, $subject, $message, $headers);
    }

    /**
     * Returns a result of a mail operation
     *
     * @return array
     */
    public function getResult()
    {
        return $this->result;
    }
}

if (isset($_POST['request'])) {
    $contact = new Contact($_POST['request']);
    $result = $contact->getResult();
    echo json_encode($result);
}
